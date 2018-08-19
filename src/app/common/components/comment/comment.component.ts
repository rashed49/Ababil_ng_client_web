import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BaseComponent } from '../base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as searchParamConstants from '../../constants/app.search.parameter.constants';
import { Comment } from '../../../services/comments/domain/comments.models';
import { CommentsService } from '../../../services/comments/service-api/comments.service';

@Component({
  selector: 'comment-component',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent extends BaseComponent implements OnInit {

  @Input('commentGroup') commentGroup: string;
  @Input('taskStep') taskStep: string;

  comments: Comment[];
  commentForm: FormGroup;

  constructor(private commentService: CommentsService, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
      this.prepareCommentForm();
      this.fetchComments();
  }

  prepareCommentForm(){
    this.commentForm = this.formBuilder.group({
         content: [null, [Validators.required, Validators.maxLength(255)]]
    });
  }

  fetchComments() {
    let urlSearchMap = new Map();
    urlSearchMap.set(searchParamConstants.COMMENT_GROUP, this.commentGroup);
    this.subscribers.fetchSub = this.commentService.fetchComments(urlSearchMap)
      .subscribe(
      data => {
        this.comments = data.content;
        this.comments.sort(function(a,b){
             if (a.dateTime>b.dateTime) return -1;
             if (a.dateTime==b.dateTime) return 0;
             if (a.dateTime<b.dateTime) return 1;
        });
      }
      );
  }

  submit(){
    let comment:Comment=this.commentForm.value;
    comment.commentGroup=this.commentGroup;
    if(this.taskStep) comment.taskStep=this.taskStep;
    this.postComment(comment);
  }

  postComment(comment: Comment) {
    this.subscribers.postSub = this.commentService.postComment(comment)
      .subscribe(
      data => {
        this.prepareCommentForm();
        this.fetchComments();
      }
      );
  }

  formsInvalid(){
    return this.commentForm.invalid;
  }

}