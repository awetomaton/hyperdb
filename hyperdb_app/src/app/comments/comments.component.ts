import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Comment, NewComment } from '../interfaces/comment';
import { HyperdbService } from '../hyperdb.service';
import { ContributorService } from '../contributor.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Contributor } from '../interfaces/contributor';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'hyperdb-comments',
  templateUrl: './comments.component.html',
  styleUrls: [
    './comments.component.scss',
    '../app.component.scss',
  ]
})
export class CommentsComponent implements OnInit {
  @Input() comments: Comment[];
  @Input() object: any;
  @Input() objectType: string;
  @Output() commentsChanged = new EventEmitter<null>();
  faTrash = faTrash;
  contributors: Contributor[] = [];
  contributorsById: Object;
  commentTitleControl = new FormControl('title', [
    Validators.required,
    Validators.minLength(1),
  ])
  commentBodyControl = new FormControl('body', [
    Validators.required,
    Validators.minLength(1),
  ])
  commentForm = new FormGroup({
    title: this.commentTitleControl,
    body: this.commentBodyControl,
  });

  constructor(
    private hyperdbService: HyperdbService, 
    public contributorService: ContributorService,
    private snackBar: MatSnackBar, 
  ){}

  ngOnInit(): void {
    this.commentForm.reset();
    this.hyperdbService.getContributors()
    .subscribe(contributors => {
      this.contributors = contributors;
    })
  }

  onDeleteComment(comment: Comment): void {
    this.hyperdbService.deleteComment(comment)
    .subscribe( response => {
      if (response != undefined) {
        this.snackBar.open("Success", 'Dismiss', {
          duration: 1000
        })
        this.commentsChanged.emit();
      }
    })
  }

  getCommentContributorName(comment: Comment): string {
    let name: string = '';
    for (let contributor of this.contributors) {
      if (comment.contributor_fk == contributor.id) {
        name = contributor.name;
        break;
      }
    }
    return name;
  }

  getRoute(comment: Comment): string {
    let url = '/';
    if (comment.geometry_fk) {
      url += 'geometries/' + comment.geometry_fk
    } else if (comment.system_fk) {
      url += 'systems/' + comment.system_fk
    } else if (comment.mesh_fk) {
      url += 'meshes/' + comment.mesh_fk
    } else if (comment.configured_tool_fk) {
      url += 'configured-tools/' + comment.configured_tool_fk
    }
    return url;
  }

  save(): void {
    let system_fk: number | null = null;
    let geometry_fk: number | null = null;
    let mesh_fk: number | null = null;
    let configured_tool_fk: number | null = null;
    if (this.objectType == 'system') {
      system_fk = this.object.id;
    } else if (this.objectType == 'geometry') {
      geometry_fk = this.object.id;
    } else if (this.objectType == 'mesh') {
      mesh_fk = this.object.id;
    } else if (this.objectType == 'configured_tool') {
      configured_tool_fk = this.object.id;
    } else {
      throw new Error('Found unknown objectType: ' + this.objectType);
    }

    let comment: NewComment = {
      'title': this.commentTitleControl.value == null ? '': this.commentTitleControl.value , 
      'body': this.commentBodyControl.value == null ? '': this.commentBodyControl.value, 
      'contributor_fk': this.contributorService.contributor == null ? -1: this.contributorService.contributor.id, 
      'system_fk': system_fk, 
      'geometry_fk': geometry_fk, 
      'mesh_fk': mesh_fk, 
      'configured_tool_fk': configured_tool_fk
    }
    this.hyperdbService.postComment(comment)
    .subscribe(response => {
      if (response) {
        this.snackBar.open("Success", 'Dismiss', {
          duration: 1000
        })
        this.commentForm.reset();
        this.commentsChanged.emit();
      }
    })
  }
}