import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  BASE_URL,
  PAGES_AMOUNT,
  Difficulty,
  DEFAULT_SELECTED_WORD,
  DEFAULT_VALUE,
  FIRST_CENTRAL_PAGE,
  LAST_CENTRAL_PAGE,
} from 'src/app/constants/constants';
import { IListWord, IOptionStats, IWordSetter, IWordSpecial } from 'src/app/interfaces/interfaces';
import { SetEnglishLevel, SetPrevVisitedPage, SetTextbookPage } from 'src/app/store/rsl.action';
import { getAllWordsSpecials, getUserWord, createUserWord, updateUserWord } from 'src/app/utilities/server-requests';
import RSLState from 'src/app/store/rsl.state';
import HttpService from './service/http.service';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss'],
})
export default class WordListComponent implements OnInit, OnDestroy {
  groupColor: string[] = ['#bce5f3', '#bcf3cd', '#f3edbc', '#f3bcbc', '#e1bcf3', '#bccdf3'];

  defaultColor: string = '#f1f3f6';

  firstCentralPage: number = FIRST_CENTRAL_PAGE;

  words: IListWord[] = [];

  allUserWords: string[] = [];

  newHardWords: string[] = [];

  newLearnedWords: string[] = [];

  learnedPages: boolean[] = [];

  @Input() isActiveTextbookPage: string = 'true';

  @Input() group: string = '0';

  page: number = 0;

  maxPage: number = PAGES_AMOUNT;

  centralPage: number;

  background: string = '';

  audio: HTMLAudioElement[] = [];

  wordProgress: string = 'не было разыграно';

  selectedWord: IListWord = DEFAULT_SELECTED_WORD;

  userId: string = '';

  @ViewChild('meaningEng')
  meaningEng: ElementRef = { nativeElement: '' };

  @ViewChild('examplesEng')
  examplesEng: ElementRef = { nativeElement: '' };

  @Input() token: string = '';

  @Select(RSLState.userId) public userId$!: Observable<string>;

  @Select(RSLState.wordsLevel) public wordsLevel$!: Observable<string>;

  @Select(RSLState.textbookPage) public textbookPage$!: Observable<string>;

  @Select(RSLState.prevVisitedPage) public prevVisitedPage$!: Observable<string>;

  constructor(public httpService: HttpService, private store: Store) {
    this.page = +this.store.selectSnapshot(RSLState.textbookPage);
    this.centralPage = this.getNewCentralPage(this.page);
    this.group = this.store.selectSnapshot(RSLState.wordsLevel);
  }

  ngOnInit(): void {
    this.userId = this.store.selectSnapshot(RSLState.userId);
    this.learnedPages = [];
    if (this.isActiveTextbookPage === 'true') {
      this.changePage(this.page);
    }
    if (this.userId) {
      this.getUserWords();
      this.checkLearnedPages(DEFAULT_VALUE, PAGES_AMOUNT, this.group);
    }
  }

  ngOnDestroy(): void {
    const prevVisitedPage: string = 'textbook';
    this.store.dispatch(new SetEnglishLevel(this.group));
    this.store.dispatch(new SetPrevVisitedPage(prevVisitedPage));
  }

  getUserWords(): void {
    getAllWordsSpecials(this.store).then((res: IWordSpecial[]): void => {
      res.forEach((el: IWordSpecial): void => {
        if (el.difficulty === Difficulty.learned) {
          this.newLearnedWords.push(el.wordId);
        }
        if (el.difficulty === Difficulty.hard) {
          this.newHardWords.push(el.wordId);
        }
        this.allUserWords.push(el.wordId);
      });
      if (this.isActiveTextbookPage === 'false') {
        this.changePageToHardWords();
        return;
      }
      this.checkLearnedPages(DEFAULT_VALUE, PAGES_AMOUNT, this.group);
    });
  }

  addWordDetails(): void {
    this.background = `url("${BASE_URL}${this.selectedWord.image}")`;
    this.meaningEng.nativeElement.innerHTML = '';
    this.examplesEng.nativeElement.innerHTML = '';
    this.examplesEng.nativeElement.insertAdjacentHTML('afterbegin', this.selectedWord.textExample);
    this.meaningEng.nativeElement.insertAdjacentHTML('afterbegin', this.selectedWord.textMeaning);
  }

  chooseWord(target: IListWord): void {
    this.selectedWord = target;
    this.addWordDetails();
    if (this.allUserWords.includes(this.selectedWord.id)) {
      this.getWordProgress();
    } else {
      this.wordProgress = 'не было разыграно';
    }
  }

  startAudio(): void {
    this.audio = [
      new Audio(`${BASE_URL}${this.selectedWord.audio}`),
      new Audio(`${BASE_URL}${this.selectedWord.audioMeaning}`),
      new Audio(`${BASE_URL}${this.selectedWord.audioExample}`),
    ];
    for (let i = 0; i < this.audio.length; i += 1) {
      if (i === 0) {
        this.audio[i].play();
      } else {
        this.audio[i - 1].onended = (): void => {
          this.audio[i].play();
        };
      }
    }
  }

  checkLearnedPages(start: number, end: number, group: string): void {
    for (let i = start; i < end; i++) {
      this.httpService.getWordsOnPage(group, i.toString()).subscribe((res: IListWord[]): void => {
        const resId: string[] = res.map((element: IListWord): string => element.id);
        const newWords: string[] = this.newHardWords.concat(this.newLearnedWords);
        const isEvery: boolean = resId.every((el: string): boolean => newWords.includes(el));
        this.learnedPages[i] = isEvery;
      });
    }
  }

  checkPage(e: Event): void {
    const target = e.currentTarget as HTMLElement;
    this.changePage(+(target.textContent || NaN) - 1);
  }

  getNewCentralPage(page: number): number {
    switch (true) {
      case page >= FIRST_CENTRAL_PAGE && page < LAST_CENTRAL_PAGE:
        this.centralPage = page + 1;
        break;
      case page >= LAST_CENTRAL_PAGE:
        this.centralPage = LAST_CENTRAL_PAGE;
        break;
      default:
        this.centralPage = FIRST_CENTRAL_PAGE;
        break;
    }
    return this.centralPage;
  }

  changePage(page: number): void {
    if (localStorage.getItem('textbookPage')) {
      this.getNewCentralPage(page);
      if (page >= 0 && page < PAGES_AMOUNT) {
        this.page = page;
      }
    }
    localStorage.setItem('textbookPage', this.page.toString());
    this.store.dispatch(new SetTextbookPage(this.page.toString()));
    this.renderWords(this.group, this.page);
  }

  renderWords(group: string, page: number): void {
    this.httpService.getWordsOnPage(group, page.toString()).subscribe((res: IListWord[]): void => {
      this.words = res;
      this.selectedWord = res[DEFAULT_VALUE] as IListWord;
      this.addWordDetails();
    });
  }

  changePageToHardWords(): void {
    getAllWordsSpecials(this.store).then((res: IWordSpecial[]): void => {
      this.words = [];
      this.selectedWord = DEFAULT_SELECTED_WORD;
      res.forEach((el: IWordSpecial): void => {
        if (this.newHardWords.includes(el.wordId)) {
          this.httpService.getWord(el.wordId, this.token).subscribe((resolve: IListWord): void => {
            this.words.push(resolve);
            this.selectedWord = this.words[DEFAULT_VALUE];
            this.background = `url("${BASE_URL}${this.selectedWord.image}")`;
          });
        }
      });
    });
  }

  getWordProgress(): void {
    getUserWord(this.store, this.selectedWord.id)
      .then((res: IWordSpecial): void => {
        if (res.difficulty === Difficulty.learned) {
          this.wordProgress = 'слово изучено';
        } else if (res.optional) {
          this.wordProgress = `${res.optional.status.split('-')[0]} из ${
            +res.optional.status.split('-')[0] + +res.optional.status.split('-')[1]
          }`;
        }
      })
      .catch((err: Response): boolean => err.ok);
  }

  async addUserWord(newWordId: string, newWordDifficulty: string): Promise<void> {
    await getUserWord(this.store, newWordId)
      .then((res: IWordSpecial): void => this.putUserWord(res.optional, newWordDifficulty))
      .catch((): void => {
        const newUserWord: IWordSetter = {
          difficulty: newWordDifficulty,
          optional: { status: '' },
        };
        createUserWord(this.store, newWordId, newUserWord);
      });
    this.checkLearnedPages(this.page, this.page + 1, this.group);
  }

  addNewWord(firstWords: string[], secondWords: string[]): void {
    const difficulty: string = firstWords === this.newHardWords ? Difficulty.hard : Difficulty.learned;
    firstWords.push(this.selectedWord.id);
    if (secondWords.includes(this.selectedWord.id)) {
      secondWords.splice(secondWords.indexOf(this.selectedWord.id), 1);
    }
    this.addUserWord(this.selectedWord.id, difficulty);
  }

  putUserWord(options: IOptionStats, newWordDifficulty: string): void {
    const newUserWord: IWordSetter = {
      difficulty: newWordDifficulty,
      optional: options,
    };
    updateUserWord(this.store, this.selectedWord.id, newUserWord);
  }

  removeUserWord(newWords: string[]): void {
    getUserWord(this.store, this.selectedWord.id).then((res: IWordSetter): void => {
      const newUserWord: IWordSetter = {
        difficulty: Difficulty.progress,
        optional: res.optional,
      };
      updateUserWord(this.store, this.selectedWord.id, newUserWord);
      newWords.splice(newWords.indexOf(this.selectedWord.id), 1);
      if (this.isActiveTextbookPage === 'false') {
        this.words.splice(this.words.indexOf(this.selectedWord), 1);
        this.selectedWord = this.words[DEFAULT_VALUE];
        this.changePageToHardWords();
        return;
      }
      this.checkLearnedPages(this.page, this.page + 1, this.group);
    });
  }
}
