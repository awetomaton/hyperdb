import { Component } from '@angular/core';
import { HyperdbService } from '../hyperdb.service';
import { ActivatedRoute } from '@angular/router';
import { Contributor } from '../interfaces/contributor';
import { Comment } from '../interfaces/comment';

@Component({
  selector: 'app-contributor',
  templateUrl: './contributor.component.html',
  styleUrls: [
    './contributor.component.scss',
    '../app.component.scss',
  ]
})
export class ContributorComponent {
  contributor: Contributor = {email: '', id: -1, name: ''};
  comments: Comment[] = [];

  constructor(private route: ActivatedRoute, private hyperdbService: HyperdbService) { }

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      let contributorId = parseInt(params['id']);
      this.hyperdbService.getContributor(contributorId).subscribe(contributor => {
        this.contributor = contributor;
      });
      this.hyperdbService.getContributorComments(contributorId).subscribe(comments => {
        this.comments = comments;
      });
    })
  }

  getComments(): void{
    this.hyperdbService.getContributorComments(this.contributor.id)
    .subscribe(comments => {
      this.comments = comments;
    })
  }
}
