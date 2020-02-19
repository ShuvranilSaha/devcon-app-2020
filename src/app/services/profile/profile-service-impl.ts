import {Request, Response, ApiService, HttpRequestType, SharedPreferences} from '@project-sunbird/sunbird-sdk';
import {Inject, Injectable} from '@angular/core';
import {map, mergeMap} from 'rxjs/operators';
import { PreferenceKeys } from 'src/config/preference-keys';
import { Observable, interval } from 'rxjs';

export interface Certificate {
  _source: {
      data: {
          badge: {
              name: string;
          };
      }
      pdfUrl: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceImpl {
  constructor(
    @Inject('API_SERVICE') private apiService: ApiService,
    @Inject('SHARED_PREFERENCES') private sharedPreferences: SharedPreferences
  ) {
  }

  public registerName(name: string): Promise<{ osid: string }> {
    const request = new Request.Builder()
      .withType(HttpRequestType.POST)
      .withPath('/api/reg/add')
      .withApiToken(true)
      .withBody({
        request: {
          Visitor: {
            name
          }
        }
      })
      .build();

    return this.apiService.fetch(request).pipe(
      map((r: Response<{
        params: {
          status: 'SUCCESSFUL' | 'UNSUCCESSFUL'
        },
        result: {
          Visitor: {
            osid: string
          }
        } | undefined,
      }>) => {
        return r.body;
      }),
      map((r) => {
        if (r.params.status !== 'SUCCESSFUL') {
          throw new Error('UNEXPECTED_RESPONSE');
        }

        return r.result!.Visitor;
      }),
    ).toPromise();
  }

  public getProfile(osid: string): Promise<{
    osUpdatedAt: string;
    code: string;
    osCreatedAt: string;
    name: string;
    osid: string;
  }> {
    const request = new Request.Builder()
      .withType(HttpRequestType.POST)
      .withPath('/api/reg/read')
      .withApiToken(true)
      .withBody({
        request: {
          Visitor: {
            osid
          }
        }
      })
      .build();

    return this.apiService.fetch(request).pipe(
      map((r: Response<{
        params: {
          status: 'SUCCESSFUL' | 'UNSUCCESSFUL'
        },
        result: {
          Visitor: {
            osUpdatedAt: string;
            code: string;
            osCreatedAt: string;
            name: string;
            osid: string;
          }
        } | undefined,
      }>) => {
        return r.body;
      }),
      map((r) => {
        if (r.params.status !== 'SUCCESSFUL') {
          throw new Error('UNEXPECTED_RESPONSE');
        }

        return r.result!.Visitor;
      }),
    ).toPromise();
  }

  public async registerPhoto(osid: string, imageBlob: Blob, name: string): Promise<{ url: string }> {
    const bearerToken = await this.sharedPreferences.getString('api_bearer_token').toPromise();

    // @ts-ignore
    const options = new FileUploadOptions();
    options.fileKey = 'file';
    options.fileName = 'some_file.png';
    options.mimeType = 'image/png';
    options.httpMethod = 'POST';
    options.headers = {
      Authorization: `Bearer ${bearerToken}`
    };
    options.params = {container: 'user/profile'};

    const blobToDataURL = (b: Blob, callback: (dataUri: any) => void) => {
      const a = new FileReader();
      a.onload = (e) => {
        callback((e.target as any).result);
      };
      a.readAsDataURL(b);
    };

    const {url} = await new Promise<{ url: string }>((resolve, reject) => {
      blobToDataURL(imageBlob, (dataUri) => {
        // @ts-ignore
        const ft = new FileTransfer();
        ft.upload(dataUri, encodeURI('https://devcon.sunbirded.org/api/content/v1/media/upload'), (r: {
          responseCode: number
          response: string
        }) => {
          if (r.responseCode === 200) {
            const result: {
              url: string;
            } = JSON.parse(r.response).result;

            if (result.url) {
              resolve(result);
              return;
            }

            reject(new Error('UNEXPECTED_RESPONSE'));
            return;
          }

          reject(r);
        }, (e: any) => {
          reject(e);
        }, options);
      });
    });

    const request = new Request.Builder()
      .withType(HttpRequestType.POST)
      .withPath('/api/regutil/visitor/new')
      .withApiToken(true)
      .withBody({
        request: {
          osid,
          photo: url,
          name
        }
      })
      .build();

    return this.apiService.fetch(request).pipe(
      map((r: Response<any>) => {
        return r.body;
      }),
      map((r) => {
        if (r.params.status !== 'SUCCESSFUL') {
          throw new Error('UNEXPECTED_RESPONSE');
        }

        return {url};
      }),
    ).toPromise();
  }

  public registerOfflineUser(code: string, name: string): Promise <{Visitor: {osid: string}}> {
    const request = new Request.Builder()
        .withType(HttpRequestType.POST)
        .withPath('/api/reg/add')
        .withApiToken(true)
        .withBody({
          request: {
            Visitor: {
              code,
              name
            }
          }
        }).build();

    return this.apiService.fetch(request).pipe(
        map((r: Response) => {
          return r.body;
        }),
        map((r) => {
          if (r.params.status !== 'SUCCESSFUL') {
            throw new Error('UNEXPECTED RESPONSE');
          }
          return r.result!.Visitor;
        }),
    ).toPromise();
  }

  public exitRegisteredUser(osid: string, visitorCode: string): Promise<string> {
    const request = new Request.Builder()
    .withType(HttpRequestType.POST)
    .withPath('/api/regutil/visitor/exit')
    .withApiToken(true)
    .withBody({
      request: {
       osid,
       visitorCode
      }
    }).build();
    return this.apiService.fetch(request).pipe(
      map((r: Response) => {
        return r.body.responseCode;
      })
    ).toPromise();
  }


  public getProfileCertificates(): Observable<Certificate[]> {
    return interval(10 * 1000).pipe(
      mergeMap(() => {
        const request = new Request.Builder()
          .withType(HttpRequestType.POST)
          .withPath('/api/certreg/v1/certs/search')
          .withApiToken(true)
          .withBody({
            request: {
                query: {
                    match_phrase: {
                        'recipient.id': localStorage.getItem(PreferenceKeys.ProfileAttributes.OSID_ATTRIBUTE)
                    }
                }
            }
          })
          .build();

        return this.apiService.fetch(request).pipe(
          map((r: Response<{
            result: {
                response: {
                    hits: Certificate[]
                };
            }
          }>) => {
            return r.body;
          }),
          map((r) => {
            if (r.result && r.result.response && r.result.response.hits) {
              return r.result.response.hits;
            }

            console.error('UNEXPECTED_RESPONSE', r, request);
            throw new Error('UNEXPECTED_RESPONSE');
          }),
        );
      })
    );
  }
}
