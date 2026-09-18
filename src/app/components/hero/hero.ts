import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {}
