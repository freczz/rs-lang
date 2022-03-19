import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DEFAULT_VALUE, FIRST_CENTRAL_PAGE, PAGES_AMOUNT } from 'src/app/constants/constants';
import { ILevels } from 'src/app/interfaces/interfaces';
import { SetIfIsTextbookPage, SetWordsLevel } from 'src/app/store/rsl.action';
import RSLState from 'src/app/store/rsl.state';
import WordListComponent from './word-list/word-list.component';

@Component({
  selector: 'app-textbook',
  templateUrl: './textbook.component.html',
  styleUrls: ['./textbook.component.scss'],
})
export default class TextbookComponent implements OnInit, AfterViewInit {
  pagesTitles: string[] = ['Учебник', 'Сложные слова'];

  levels: ILevels[] = [
    {
      title: 'Elementary',
      level: 'A1',
      group: '0',
    },
    {
      title: 'Pre-Intermediate',
      level: 'A2',
      group: '1',
    },
    {
      title: 'Intermediate',
      level: 'B1',
      group: '2',
    },
    {
      title: 'Upper-Intermediate',
      level: 'B2',
      group: '3',
    },
    {
      title: 'Advanced',
      level: 'C1',
      group: '4',
    },
    {
      title: 'Proficiency',
      level: 'C2',
      group: '5',
    },
  ];

  isActiveTextbookPage: string;

  activeEnglishLevel: string;

  page: string;

  token: string = '';

  @ViewChild(WordListComponent, { static: false })
  public wordListComponent: WordListComponent | undefined;

  @Select(RSLState.token) public token$!: Observable<string>;

  @Select(RSLState.textbookPage) public textbookPage$!: Observable<string>;

  @Select(RSLState.isTextbookPage) public isTextbookPage$!: Observable<string>;

  @Select(RSLState.wordsLevel) public wordsLevel$!: Observable<string>;

  constructor(private store: Store) {
    this.page = this.store.selectSnapshot(RSLState.textbookPage) || '0';
    this.isActiveTextbookPage = this.store.selectSnapshot(RSLState.isTextbookPage) || 'true';
    this.activeEnglishLevel = this.store.selectSnapshot(RSLState.wordsLevel) || '0';
  }

  ngOnInit(): void {
    this.token = this.store.selectSnapshot(RSLState.token);
    if (!this.token) {
      this.isActiveTextbookPage = 'true';
    }
  }

  ngAfterViewInit(): boolean | undefined {
    return this.wordListComponent?.learnedPages[this.wordListComponent?.page || 0];
  }

  togglePage(e: Event): void {
    const target = e.currentTarget as HTMLElement;
    if (target.classList.contains('page-disabled')) {
      this.isActiveTextbookPage = 'true';
    } else if (target.classList.contains('page-unactive')) {
      this.isActiveTextbookPage = this.isActiveTextbookPage === 'true' ? 'false' : 'true';
    }
    localStorage.setItem('isTextbookPage', this.isActiveTextbookPage);
    this.store.dispatch(new SetIfIsTextbookPage(this.isActiveTextbookPage));
    if (this.isActiveTextbookPage === 'true') {
      this.wordListComponent?.renderWords(this.activeEnglishLevel, +(localStorage.getItem('textbookPage') || 0));
    } else {
      this.wordListComponent?.changePageToHardWords();
    }
  }

  toggleLevel(target: ILevels): void {
    this.activeEnglishLevel = target.group;
    localStorage.setItem('wordsLevel', this.activeEnglishLevel);
    this.store.dispatch(new SetWordsLevel(this.activeEnglishLevel));

    if (localStorage.getItem('textbookPage')) {
      localStorage.removeItem('textbookPage');
    }
    if (this.wordListComponent?.page) {
      this.wordListComponent.page = 0;
      this.wordListComponent.centralPage = FIRST_CENTRAL_PAGE;
      localStorage.setItem('textbookPage', this.wordListComponent.page.toString());
    }
    this.wordListComponent?.renderWords(this.activeEnglishLevel, +(localStorage.getItem('textbookPage') || 0));
    this.wordListComponent?.checkLearnedPages(DEFAULT_VALUE, PAGES_AMOUNT, this.activeEnglishLevel);
  }
}
