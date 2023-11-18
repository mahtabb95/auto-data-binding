import { Component } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';

@Component({
  template: `
    <form class="form">
      <label for="name">name:</label>
      <input nbInput id="name" type="text">

      <label for="file">file:</label>
      <input nbInput id="file" type="text">

      <label for="image">image:</label>
      <input nbInput id="image" type="text">

      <label for="email">email:</label>
      <input nbInput id="email" type="text">

      <label for="description">description:</label>
      <input nbInput id="description" type="text">

      <label class="text-label" for="date">date:</label>
      <textarea nbInput id="date"></textarea>
    </form>
  `,
  styleUrls: ['window-form.component.scss'],
})
export class WindowFormComponent {
  constructor(public windowRef: NbWindowRef) { }

  close() {
    this.windowRef.close();
  }
}
