import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class ModalComponent {

  constructor(private modalController: ModalController) { }


  dismissModal() {
    this.modalController.dismiss();
  }
}
