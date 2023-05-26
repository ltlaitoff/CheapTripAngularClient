import { Component, OnInit } from '@angular/core';
// import { link } from 'fs';
import { LinkCard } from './link-card';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
cards:Array<LinkCard> = new Array<LinkCard>();
  constructor() { 

  
  }

  ngOnInit(): void { 
     this.cards.push (new LinkCard("BlaBlaCar","https://www.blablacar.com/","Share your journey with BlaBlaCar - Trusted carpooling"));
     this.cards.push (new LinkCard("Skyscanner","https://www.skyscanner.net/","Skyscanner: Compare Cheap Flights, Hotels & Car Hire | Last Minute Flights"));
    // this.cards.push (new LinkCard("title","link","desc"));
    this.cards.push (new LinkCard("Пассажирам","https://www.rzd.ru/#","Официальный портал ОАО «РЖД». Купить билет на поезд без комиссии. Акции и скидки. Расписание поездов и электричек по всем направлениям. Скоростные поезда «Сапсан», «Ласточка», «Стриж» и «Аллегро»."));
   this.cards.push (new LinkCard("Tutu.ru: Авиа, ЖД, билеты на автобус и туры онлайн.","https://www.tutu.ru/","Tutu.ru — это продажа ж/д билетов, авиабилетов, туров и билетов на автобус, бронирование отелей, точное расписание электричек. Также вы найдете у нас обширную справочную информацию для путешественников."));
  this.cards.push (new LinkCard("Название","гиперссылка","описание"));
  }
  goToLink(url: string){
    window.open(url, "_blank");
}



}
