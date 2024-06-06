import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMessage } from '../models/methods.models';
import { OpenaiService } from '../services/openai.service';
import { IonContent, ModalController } from '@ionic/angular';
import { CustomValidators } from 'src/utils/custom-validators';
import { ModalComponent } from '../components/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent, {static: false}) content!: IonContent;

  messages: IMessage[] = [];

  form = new FormGroup({
    prompt: new FormControl('', [ Validators.required, CustomValidators.noWhiteSpace ])
  })

  loading: boolean = false;

  constructor(
    private openAi: OpenaiService,
    private modalController: ModalController
  ) {}

  submit() {
    if(this.form.valid) {
        let prompt = this.form.value.prompt as string;

        if (!prompt) {
            console.error('Prompt is empty or invalid');
            return;
        }

        // Mensaje del usuario
        let userMsg: IMessage = {
          sender: 'me',
          content: prompt
        };
        this.messages.push(userMsg);

        // Mensaje del bot
        let botMsg: IMessage = {
          sender: 'bot',
          content: ''
        };
        this.messages.push(botMsg);

        this.scrollToBottom();
        this.form.reset();
        this.form.disable();

        this.loading = true;

        this.openAi.sendQuestion(prompt).subscribe({
          next: (res: any) => {
            this.loading = false;
            this.typeText(res.bot);
            this.form.enable();
          },
          error: (error: any) => {
              this.loading = false;
              console.error('Error al obtener respuesta del bot:', error);
          }
      });
    }
}

  typeText(text: string) {
    if (!text) {
        // Si no hay texto, no hay nada que hacer
        return;
    }

    let textIndex = 0;
    let messagesLastIndex = this.messages.length - 1;

    let interval = setInterval(() => {
        if (textIndex < text.length) {
            this.messages[messagesLastIndex].content += text.charAt(textIndex);
            textIndex++;
        } else {
            clearInterval(interval);
            this.scrollToBottom();
        }
    }, 15);
  }

  scrollToBottom() {
    this.content.scrollToBottom(2000);
  }

  async openInfoModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
    });
    return await modal.present();
  }
}
