import { Injectable } from '@angular/core';

import { WpxApi } from '@weplanx/ng';

import { Order } from '../types';

@Injectable()
export class OrdersService extends WpxApi<Order> {
  protected override collection = 'x_orders';
}
