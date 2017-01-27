import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ChannelComponent } from '../channel/channel.component';
import { Client } from '../../common/services/api/client';
import { Storage } from '../../common/services/storage';


@Component({
  moduleId: 'module.id',
  selector: 'newsfeed-list',
  templateUrl: 'list.component.html',
  //styleUrls: ['list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewsfeedList {

  feed : Array<any> = [];
  offset : string = "";
  inProgress : boolean = true;

  components = {
    channel: ChannelComponent
  }

  constructor(private client : Client, private cd : ChangeDetectorRef, private storage : Storage){}

  ngOnInit(){
    this.loadList();
  }

  loadList(){
    return new Promise((res, err) => {
      this.inProgress = true;
      this.client.get('api/v1/newsfeed', { limit: 12, offset: this.offset})
        .then((response : any) => {
          //console.log(response);
          for(let activity of response.activity){
            this.feed.push(activity);
          }
          this.inProgress = false;
          this.offset = response['load-next'];
          res();
          this.cd.markForCheck();
          this.cd.detectChanges();
        });
    });
  }

  refresh(puller){
    puller.complete();
    this.offset = "";
    this.feed = [];
    this.loadList()
      .then(() => {
        puller.complete();
      });
  }

  loadMore(e){
    this.loadList()
      .then(() => {
        e.complete();
      });
  }

}
