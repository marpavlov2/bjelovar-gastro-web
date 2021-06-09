import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { FoodExtrasDialogComponent } from "../food-extras-dialog/food-extras-dialog.component";
import { Product } from "../interfaces/product.interface";
import { ProductNoteDialogComponent } from "../product-note-dialog/product-note-dialog.component";
import { AuthService } from "../services/auth.service";
import { MasterDataService } from "../services/master-data.service";

@Component({
  selector: "app-restaurant-page",
  templateUrl: "./restaurant-page.component.html",
  styleUrls: ["./restaurant-page.component.scss"],
})
export class RestaurantPageComponent implements OnInit {
  productId: string;
  producerId: string;
  searchTerm: string;
  segmentName: number = 0;
  alertTitle = "";
  myInputs = [];
  objectExtras: Product[];
  isWorking = false;
  foodExtras: Product[];
  filteredProducerProducts: any[];

  search() {
    let args = this.searchTerm.toLowerCase();

    if (this.md.producerProducts) {
      let categoriesSelected = [];
      [...this.md.producerProducts].filter((element) => {
        const filtered = element.products.filter(function (item) {
          return JSON.stringify(item.name).toLowerCase().includes(args);
        });
        if (filtered.length) {
          const copy = {
            ...element,
          };
          copy.products = filtered;
          categoriesSelected.push(copy);
        }
      });
      this.filteredProducerProducts = categoriesSelected;
    }
  }

  get hasOrder() {
    if (this.md.userProductsList) {
      let found = false;
      for (let i = 0; i < this.md.userProductsList.length; i++) {
        if (found) {
          break;
        }
        this.md.userProductsList[i].products.filter((product) => {
          if (product.orderQuantity > 0) {
            found = true;
          }
        });
      }
      return found;
    }
  }

  get totalPrice() {
    if (this.md.userProductsList) {
      let total: number = 0;
      for (let i = 0; i < this.md.userProductsList.length; i++) {
        const products = this.md.userProductsList[i].products;
        products.filter((product) => {
          if (product.orderQuantity) {
            if (product.discount) {
              total += product.discountDisplayPrice * product.orderQuantity;
            } else {
              total += product.displayPrice * product.orderQuantity;
            }
            if (product.foodExtras) {
              product.foodExtras.forEach((foodExtra) => {
                total += foodExtra.displayPrice * foodExtra.quantity;
              });
            }
          }
        });
      }
      return total;
    }
  }

  private subscriptions: Subscription;

  constructor(
    private router: Router,
    public md: MasterDataService,
    private route: ActivatedRoute,
    private auth: AuthService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.subscriptions = this.route.params.subscribe(async (params) => {
      this.producerId = params["restaurantId"];
      this.productId = params["productId"];

      if (!this.md.producer) {
        this.md.producer = await this.md.getProducer(this.producerId);
      }

      if (this.md.producer.deliveryDays) {
        const deliveryDays = this.md.producer.deliveryDays;
        for (const property in deliveryDays) {
          var format = "hh:mm:ss";
          let start = deliveryDays[property].split("-")[0];
          let end = deliveryDays[property].split("-")[1];
          let currentTime = moment();
          let day = currentTime.format("dddd").toLowerCase();

          if (property === day) {
            let time = moment(currentTime, format);
            let beforeTime = moment(start, format);
            let afterTime = moment(end, format);

            console.log(day, beforeTime, afterTime);
            if (time.isBetween(beforeTime, afterTime)) {
              this.isWorking = true;
            } else {
              this.isWorking = false;
            }
          }
        }
      }

      if (this.md.userProductsList.length === 0) {
        this.md.producerProducts = await this.md.getProducerProducts(
          this.producerId
        );
        this.md.userProductsList = [...this.md.producerProducts];
        this.md.userProductsList.forEach((category) => {
          category.products.forEach((product) => {
            product.orderQuantity = 0;
          });
        });
        this.filteredProducerProducts = [...this.md.userProductsList];

        if (this.productId) {
          setTimeout(() => {
            this.scrollTo(this.productId);
          }, 300);
        }
      }
    });
  }

  scrollTo(element: string) {
    let b = document.getElementById(element);
    if (b) {
      b.scrollIntoView({ behavior: "smooth", block: "center" });
      b.style.background = "#e8edf0";
    }
  }

  async openProductNote(id: number) {
    let productNote = "";

    this.md.userProductsList.forEach((category) => {
      return category.products.find((product) => {
        if (product.id === id) {
          productNote = product.productNote;
        }
      });
    });

    const dialogRef = this.dialog.open(ProductNoteDialogComponent, {
      width: "250px",
      data: { value: productNote },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const productNote = result.productNote;
      this.setProductNote(id, productNote);
    });
  }

  createInputs(product: any) {
    const theNewInputs = [];
    for (const element of product.extraFood) {
      let hasExtra = false;
      if (product) {
        hasExtra = product.foodExtras
          ? product.foodExtras.some((foodExtra) => foodExtra.id === element.id)
          : null;
      }
      theNewInputs.push({
        type: "checkbox",
        label: element.name + "    (+" + element.displayPrice + " kn)",
        value: {
          id: element.id,
          displayPrice: element.displayPrice,
          name: element.name,
          quantity: 1,
        },
        checked: hasExtra ? true : false,
      });
    }
    return theNewInputs;
  }

  async openFoodExtras(product: Product, id: number) {
    // https://forum.ionicframework.com/t/ionic4-alert-dynamic-checkboxes/161426/2
    this.myInputs = this.createInputs(product);
    console.log(this.myInputs);

    const dialogRef = this.dialog.open(FoodExtrasDialogComponent, {
      width: "250px",
      data: { value: this.myInputs },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.md.userProductsList.forEach((category) => {
          return category.products.find((product) => {
            if (product.id === id) {
              product.foodExtras = result.map(foodExtra => foodExtra.value);
            }
          });
        });
      }
    });
  }

  viewImage(url: string, name: string) {
    /*     const option: PhotoViewerOptions = {
      share: false,
    };
    this.photoViewer.show(url, name, option); */
  }

  setProductNote(id: number, productNote: string) {
    this.md.userProductsList.forEach((category) => {
      category.products.find((product) => {
        if (product.id === id) {
          product.productNote = productNote;
        }
      });
    });
  }

  increaseQuantity(id: number) {
    this.md.userProductsList.forEach((category) => {
      category.products.find((product) => {
        if (product.id === id) {
          product.orderQuantity++;
        }
      });
    });
  }

  decreaseQuantity(id: number) {
    this.md.userProductsList.forEach((category) => {
      category.products.find((product) => {
        if (product.id === id) {
          if (product.orderQuantity > 0) {
            product.orderQuantity--;
          }
        }
      });
    });
  }

  async gotoDirections() {
    let user = await this.auth.user;
    this.router.navigate([
      `/direction/${this.md.producer.address}/${this.md.producer.city}/${user.city}/${user.address}`,
    ]);
  }

  toggleSection(categoryIndex: number, productIndex: number) {
    let producerCategoryProducts = this.md.producerProducts[categoryIndex];

    producerCategoryProducts.products[productIndex].open =
      !producerCategoryProducts.products[productIndex].open;
    if (producerCategoryProducts.products[productIndex].open) {
      producerCategoryProducts.products
        .filter((product, itemIndex) => itemIndex != productIndex)
        .map((product) => (product.open = false));
    }
  }

  getUserOrderedProducts() {
    if (this.md.userProductsList) {
      let orderedProducts: Array<any> = [];
      for (let i = 0; i < this.md.userProductsList.length; i++) {
        const products = [...this.md.userProductsList[i].products];
        products.filter((product) => {
          if (product.orderQuantity) {
            orderedProducts.push(product);
          }
        });
      }
      return orderedProducts;
    }
  }

  async gotoConfirmOrder() {
    let userOrderList = this.getUserOrderedProducts();
    const user = await this.auth.user;
    this.md.orderData = {
      deliveryAddress: this.md.producer.address,
      products: userOrderList,
      userCity: user.city,
      userAddress: user.address,
      producerId: this.md.producer.id,
      producerName: this.md.producer.name,
      producerTelephone: this.md.producer.phone,
      producerAddress: this.md.producer.address,
      producerCity: this.md.producer.city,
      userTelephone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      email: this.md.producer.email,
      total: this.totalPrice.toFixed(2),
      userId: user.id,
      producerPlayerId: this.md.producer.admin.customerPlayerId
        ? this.md.producer.admin.customerPlayerId
        : "",
      customerPlayerId: user.customerPlayerId ? user.customerPlayerId : "",
      deliveryPrice: this.md.producer.deliveryPrice,
    };
    this.router.navigate([`/confirm-order/${this.md.producer.id}`]);
  }

  async segmentChanged(ev: any) {
    this.segmentName = ev.index;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
