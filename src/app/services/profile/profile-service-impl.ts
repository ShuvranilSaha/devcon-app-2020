import {Request, Response} from '@project-sunbird/sunbird-sdk';
import {ApiService, HttpRequestType} from '@project-sunbird/sunbird-sdk/dist';
import {Inject, Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceImpl {
  constructor(
    @Inject('API_SERVICE') private apiService: ApiService
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
}
