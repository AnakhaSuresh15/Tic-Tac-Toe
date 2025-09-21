import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'tic-tac-toe';
  sign = 'O';
  visitedO: number[] = [];
  visitedI: number[] = [];
  systemKey = 'X';
  gameScreen = false;
  readonly dialog = inject(MatDialog);

  winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  constructor() {}
  startScreen(key: string) {
    this.gameScreen = true;
    this.systemKey = key;
    const selectScreen = document.getElementsByClassName(
      'selectScreen'
    )[0] as HTMLElement;
    selectScreen.style.display = 'none';
    const table = document.getElementById('table');
    table?.classList.remove('hide');
  }
  cellSelected(num: number) {
    const visited =
      this.visitedI.some((elem) => elem == num) ||
      this.visitedO.some((elem) => elem == num);
    if (!visited) {
      const cellId = 'cell' + num;
      const cell = document.getElementById(cellId);
      if (cell) {
        cell.innerHTML = this.sign;
        if (this.sign == 'O') {
          this.visitedO.push(num);
          this.sign = 'X';
          this.winningCombos.forEach((combo) => {
            let win = combo.every((elem) => this.visitedO.includes(elem));
            if (win) {
              this.gameWon(combo, 'O');
            }
          });
        } else if (this.sign == 'X') {
          this.visitedI.push(num);
          this.sign = 'O';
          this.winningCombos.forEach((combo) => {
            let win = combo.every((elem) => this.visitedI.includes(elem));
            if (win) {
              this.gameWon(combo, 'X');
            }
          });
        }
      }
      if (this.visitedO.length > 4 || this.visitedO.length > 4) {
        this.showAlert('N');
      }
    }
    this.selectNext();
  }
  selectNext() {}
  gameWon(combo: number[], char: string) {
    combo.forEach((elem) => {
      const id = 'cell' + elem;
      const cell = document.getElementById(id);
      if (cell) {
        if (char == 'O') {
          cell.style.backgroundColor = '#ef917e';
        } else if (char == 'X') {
          cell.style.backgroundColor = '#dd7f9f';
        }
      }
    });
    this.showAlert(char);
  }
  showAlert(char: string) {
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { type: char },
      width: '520px',
      maxHeight: '80vh',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.reset();
      } else {
        const elements = document.querySelectorAll('td');
        elements.forEach((elem) => {
          elem.classList.remove('cellText');
          elem.classList.add('noSelect');
        });
      }
    });
  }
  reset() {
    this.visitedI.forEach((elem) => {
      const id = 'cell' + elem;
      const cell = document.getElementById(id);
      if (cell) {
        cell.innerHTML = '';
        cell.style.backgroundColor = '#4b495f';
      }
    });
    this.visitedO.forEach((elem) => {
      const id = 'cell' + elem;
      const cell = document.getElementById(id);
      if (cell) {
        cell.innerHTML = '';
        cell.style.backgroundColor = '#4b495f';
      }
    });
    this.visitedI = [];
    this.visitedO = [];
    this.sign = 'O';
    const elements = document.querySelectorAll('td');
    elements.forEach((elem) => {
      elem.classList.remove('noSelect');
      elem.classList.add('cellText');
    });
  }
  restart() {
    this.gameScreen = false;
    this.systemKey = 'X';
  }
}
