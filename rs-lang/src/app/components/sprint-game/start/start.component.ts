import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import RSLState from '../../../store/rsl.state';
import { LevelGame } from '../../../interfaces/interfaces';
import { LIST_LEVELS } from '../../../constants/constants';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
class StartComponent implements OnInit {
  listLevels: string[] = LIST_LEVELS;

  level: string = '0';

  disable: boolean = true;

  isDefaultStart: boolean = true;

  @ViewChild('levelBtns', { static: false })
  levelsBtns: ElementRef | undefined;

  @Output() checkLevel = new EventEmitter<LevelGame>();

  @Select(RSLState.prevVisitedPage) public prevVisitedPage$!: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    const prevVisitedPage: string = this.store.selectSnapshot(RSLState.prevVisitedPage);
    if (prevVisitedPage === 'textbook') {
      this.isDefaultStart = false;
      this.disable = false;
    }
  }

  chooseLevel($event: Event): void {
    const target = $event.target as HTMLElement;
    if (!target.id) return;
    if (this.levelsBtns) {
      [...this.levelsBtns.nativeElement.children].forEach((element: HTMLElement) => {
        element.classList.remove('active');
      });
    }
    target.classList.add('active');
    this.disable = false;
    this.level = target.id;
  }

  change(isClick: boolean): void {
    this.checkLevel.emit({ isStart: isClick, level: this.level });
  }
}

export default StartComponent;
