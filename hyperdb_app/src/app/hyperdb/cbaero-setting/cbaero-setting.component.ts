import { Component, Input, OnInit } from '@angular/core';
import { CBAeroSetting } from '../../interfaces/cbaero_setting';
import { HyperdbService } from '../../services/hyperdb.service';


@Component({
  selector: 'hyperdb-cbaero-setting',
  templateUrl: './cbaero-setting.component.html',
  styleUrls: ['./cbaero-setting.component.scss']
})
export class CBAeroSettingComponent implements OnInit {
  cbaeroSetting: CBAeroSetting = {'conf_file': '', 'id': -1};
  @Input() id: number;

  constructor(public hyperdbService: HyperdbService){}
  
  ngOnInit(): void {
    this.hyperdbService.getCBAeroSetting(this.id).subscribe(setting => {
      this.cbaeroSetting = setting;
    })
  }
}
