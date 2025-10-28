import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-text-editor',
  imports: [FormsModule, EditorComponent],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.css',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class TextEditor implements OnInit{
  @Input() htmlContent: string = ''; 
  @Output() saveContent = new EventEmitter<string>(); 

  @ViewChild(EditorComponent) editorComp?: EditorComponent;

  content: string = '';

  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount',
    toolbar: [
    'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
    'bullist numlist outdent indent | link image table | code | removeformat | help'
  ].join(' '),
    menubar: false,
    height: 400
  };

  ngOnInit(): void {
    this.content = this.htmlContent; // Initialize content
  }

  ngOnChanges(): void {
    // Update editor content if input changes
    this.content = this.htmlContent;
  }

  onSave() {
    // Emit current editor content
    this.saveContent.emit(this.content);
  }

  onEditorChange(content: string) {
    this.content = content;
  }

}
