import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Tool } from 'src/app/interfaces/tool';
import { ContributorService } from 'src/app/services/contributor.service';
import { HyperdbService } from 'src/app/services/hyperdb.service';


@Component({
  selector: 'app-new-aero-run',
  templateUrl: './new-aero-run.component.html',
  styleUrls: ['./new-aero-run.component.scss']
})
export class NewAeroRunComponent implements OnInit {
  tools: Tool[] = [];

  aeroRunForm = new FormGroup({
      tool: new FormControl('tool', [Validators.required,]),
      toolVersion: new FormControl('toolVersion', [Validators.required,]),
  })

  constructor(
    public hyperdbService: HyperdbService, 
    private router: Router,
    private snackBar: MatSnackBar,
    public contributorService: ContributorService) {
  }
  ngOnInit(): void {
    this.hyperdbService.getTools()
    .subscribe(tools => {
      this.tools = tools;
    })
  }

  getUniqueToolNames(): string[] {
    let uniqueToolNames: string[] = [];
    this.tools.forEach(tool => {
      if (!uniqueToolNames.includes(tool.name)) {
        uniqueToolNames.push(tool.name);
      }
    })
    return uniqueToolNames;
  }

  getSelectedToolVersions(): Tool[] {
    let selectedTool = this.aeroRunForm.get('tool')?.value;
    let selectedToolVersions = this.tools.filter(tool => tool.name == selectedTool);
    return selectedToolVersions;
  }

  }
