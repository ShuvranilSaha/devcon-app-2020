import {Component, OnInit} from '@angular/core';
import {PreferenceKeys} from '../../config/preference-keys';
import {QrCodeServiceImpl} from '../services/qr-code.service';

interface Stall {
  code: string;
  osCreatedAt: string;
  type: string;
  name: string;
  osid: string;
  ideas?: Idea[];
}

interface Idea {
  code: string;
  osCreatedAt: string;
  '@type': string;
  name: string;
  description: string;
  osid: string;
  stallCode: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  qrcodeDataURL?: string;
  public readonly profilePicURL = localStorage.getItem(PreferenceKeys.ProfileAttributes.URL_ATTRIBUTE)!;
  public readonly profileName = localStorage.getItem(PreferenceKeys.ProfileAttributes.NAME_ATTRIBUTE)!;

  private stallList: Stall[] = [
    {
      code: 'STA1',
      osCreatedAt: '2020-02-17T09:47:47.853522Z',
      type: 'Stall',
      name: 'Creation',
      osid: '1-88fd7c2f-1127-4953-852a-6e1688ef53ef'
    },
    {
      code: 'STA2',
      osCreatedAt: '2020-02-17T09:47:48.033772Z',
      type: 'Stall',
      name: 'School',
      osid: '1-e7637637-50d3-4e24-be85-c6828d78a298'
    }
  ];
  private ideaList: Idea[] = [
    {
      code: 'IDE1',
      osCreatedAt: '2020-02-17T09:48:05.484322Z',
      '@type': 'Idea',
      name: 'Multiplayer Quiz',
      description: 'School Quiz Competition',
      osid: '1-2d5e7c67-74cd-4aaf-974d-be15ec26f3a5',
      stallCode: 'STA1'
    },
    {
      code: 'IDE1',
      osCreatedAt: '2020-02-17T09:48:05.484322Z',
      '@type': 'Idea',
      name: 'Multiplayer Quiz',
      description: 'School Quiz Competition',
      osid: '1-2d5e7c67-74cd-4aaf-974d-be15ec26f3a5',
      stallCode: 'STA1'
    },
    {
      code: 'IDE2',
      osCreatedAt: '2020-02-17T09:48:05.679641Z',
      '@type': 'Idea',
      name: 'Library',
      description: 'School Library',
      osid: '1-a60d49ba-fe7e-4cb1-9368-8b32266fd643',
      stallCode: 'STA1'
    },
    {
      code: 'IDE3',
      osCreatedAt: '2020-02-17T09:48:05.787030Z',
      '@type': 'Idea',
      name: 'Compute Lab',
      description: 'School Compute Lab',
      osid: '1-bb8e95b9-446b-4dfd-8f92-0f59526d4cda',
      stallCode: 'STA2'
    },
    {
      code: 'IDE4',
      osCreatedAt: '2020-02-17T09:48:05.875741Z',
      '@type': 'Idea',
      name: 'Interactive Session',
      description: 'Interactive Session in Training',
      osid: '1-0acfe65a-ebd8-409d-b77c-e616c28eadcb',
      stallCode: 'STA2'
    }
  ];

  constructor(
    private qrcodeService: QrCodeServiceImpl
  ) {
    this.stallList.forEach((stall: Stall) => {
      stall.ideas = this.ideaList.filter((idea) => idea.stallCode === stall.code);
    });
  }

  async ngOnInit() {
    this.qrcodeDataURL = await this.qrcodeService.generateDataUrl(
      localStorage.getItem(PreferenceKeys.ProfileAttributes.QR_CODE_DATA_ATTRIBUTE)!
    );
  }

}
