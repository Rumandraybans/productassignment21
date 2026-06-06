import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent implements OnInit {
  productForm!: FormGroup;
  products: any[] = [];
  isEditing: boolean = false;
  currentProductId: string = '';

  constructor(private fb: FormBuilder, private productService: ProductService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      stock: ['', Validators.required]
    });
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    if (this.isEditing) {
      this.productService.updateProduct(this.currentProductId, this.productForm.value).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
        }
      });
    } else {
      this.productService.addProduct(this.productForm.value).subscribe({
        next: () => {
          this.loadProducts(); 
          this.productForm.reset();
        }
      });
    }
  }

  editClick(product: any) {
    this.isEditing = true;
    this.currentProductId = product._id;
    this.productForm.patchValue(product);
  }

  cancelEdit() {
    this.isEditing = false;
    this.currentProductId = '';
    this.productForm.reset();
  }

  deleteProduct(id: string) {
    if (confirm('Permanently delete this item configuration?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(); 
        }
      });
    }
  }
}