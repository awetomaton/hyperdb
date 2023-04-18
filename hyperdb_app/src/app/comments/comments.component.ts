import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Comment, NewComment } from '../interfaces/comment';
import { HyperdbService } from '../hyperdb.service';
import { Contributor } from '../interfaces/contributor';


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
  @Output() postedComment = new EventEmitter<null>();
  contributors: Contributor[];
  contributorsById: Object;
  commentTitleControl = new FormControl('title', [
    Validators.required,
    Validators.minLength(1),
  ])
  contributorControl = new FormControl('contributor', [
    Validators.required,
  ])
  commentBodyControl = new FormControl('body', [
    Validators.required,
    Validators.minLength(1),
  ])
  commentForm = new FormGroup({
    title: this.commentTitleControl,
    contributor: this.contributorControl,
    body: this.commentBodyControl,
  });

  constructor(private hyperdbService: HyperdbService){}

  ngOnInit(): void {
    this.commentForm.reset();
    this.hyperdbService.getContributors()
    .subscribe(contributors => {
      this.contributors = contributors;
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

  save(): void {
    let contributor_fk: number = -1;
    for (let contributor of this.contributors) {
      if (this.contributorControl.value == contributor.name){
        contributor_fk = contributor.id;
        break;
      }
    }
    let system_fk: number | null = null;
    let geometry_fk: number | null = null;
    let mesh_fk: number | null = null;
    let tool_mesh_association_fk: number | null = null;
    let configured_tool_fk: number | null = null;
    if (this.objectType == 'system') {
      system_fk = this.object.id;
    } else if (this.objectType == 'geometry') {
      geometry_fk = this.object.id;
    } else if (this.objectType == 'mesh') {
      mesh_fk = this.object.id;
    } else if (this.objectType == 'tool_mesh_association') {
      tool_mesh_association_fk = this.object.id;
    } else if (this.objectType == 'configured_tool') {
      configured_tool_fk = this.object.id;
    } else {
      throw new Error('Found unknown objectType: ' + this.objectType);
    }

    let comment: NewComment = {
      'title': this.commentTitleControl.value == null ? '': this.commentTitleControl.value , 
      'body': this.commentBodyControl.value == null ? '': this.commentBodyControl.value, 
      'contributor_fk': contributor_fk, 
      'system_fk': system_fk, 
      'geometry_fk': geometry_fk, 
      'mesh_fk': mesh_fk, 
      'tool_mesh_association_fk': tool_mesh_association_fk, 
      'configured_tool_fk': configured_tool_fk
    }
    this.hyperdbService.postComment(comment)
    .subscribe(_ => {
      this.commentForm.reset();
      this.postedComment.emit();
    })
  }
}