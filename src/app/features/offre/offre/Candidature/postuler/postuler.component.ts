import { Component } from '@angular/core';
import { HeaderBanner3Component } from "../../../../header&footer/banners/header-banner3/header-banner3.component";
import { PropCvComponent } from "../prop-cv/prop-cv.component";

@Component({
  selector: 'app-postuler',
  imports: [HeaderBanner3Component, PropCvComponent],
  templateUrl: './postuler.component.html',
  styleUrl: './postuler.component.css'
})
export class PostulerComponent {

}
