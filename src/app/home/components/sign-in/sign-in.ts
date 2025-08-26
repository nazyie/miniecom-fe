import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn implements OnInit{
  form: FormGroup = new FormGroup({});

  ngOnInit() {
    this.form = new FormBuilder().group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]

    });
  }

  submitForm() {
    console.log(this.form.value);
  }

}
