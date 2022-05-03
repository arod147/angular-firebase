import { Component, OnInit } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import { collectionData, Firestore, collection, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todo: Task[] = [
    {
      title: 'Buy milk',
      description: 'Go to the store and buy milk'
    },
    {
      title: 'Create a Code-By-Alex app',
      description: 'Using Firebase and Angular create a Code-By-Alex app!'
    }
  ]
  inProgress: Task[] = [];
  done: Task[] = [];

  // x: Observable<Task[]>
  constructor(private dialog: MatDialog, private store: Firestore) {
    // const collect = collection(this.store, 'items')
    // const x = collectionData(collect) as Observable<Task[]>;
  }

  // todo = collectionData(collection(this.store, 'todo'), {idField: 'id'}) as Observable<Task[]>

  // todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  // inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  // done = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;

  // y() {
  //   const collect = collection(this.store, 'items')
  //   const x = collectionData(collect) as Observable<Task[]>;;
  //   x.forEach((item) => console.log(item))
  //   // console.log(x.subscribe())
  // }

  // ngOnInit(): void {
  //   this.y()
  // }
  
  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult|undefined) => {
      if (!result) {
        return;
      }
      const dataList = this[list];
      const taskIndex = dataList.indexOf(task);
      if (result.delete) {
        dataList.splice(taskIndex, 1);
      } else {
        dataList[taskIndex] = task;
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult|undefined) => {
        if (!result) {
          return;
        }
        this.todo.push(result.task);
      });
  }

}
