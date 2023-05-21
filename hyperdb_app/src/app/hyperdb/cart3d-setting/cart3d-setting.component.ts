import { Component, Input } from '@angular/core';
import { Cart3DSetting } from '../../interfaces/cart3d_setting';
import { HyperdbService } from '../../services/hyperdb.service';

@Component({
  selector: 'hyperdb-cart3d-setting',
  templateUrl: './cart3d-setting.component.html',
  styleUrls: ['./cart3d-setting.component.scss']
})
export class Cart3DSettingComponent {
  cart3DSetting: Cart3DSetting = {'cntl_file': '', 'id': -1};
  @Input() id: number;

  constructor(public hyperdbService: HyperdbService){}
  
  ngOnInit(): void {
    this.hyperdbService.getCart3DSetting(this.id).subscribe(setting => {
      this.cart3DSetting = setting;
    })
  }
}
