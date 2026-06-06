import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-dashboard.html'
})
export class CustomerDashboardComponent implements OnInit {
  products: any[] = [];
  cartItems: any[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.productService.getProducts().subscribe({
      next: data => {
        this.products = data;
      },
      error: err => console.error('Error loading catalog products:', err)
    });
    
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: res => {
        this.cartItems = res.items || [];
      },
      error: err => console.error('Error loading shopping cart summary:', err)
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.loadCart(); // Dynamically updates right-side panel without reload
      }
    });
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}