import { gql } from "@apollo/client";
import React from "react";

export const DISH_FRAGMENT = gql`
  fragment DishParts on Dish {
    id
    name
    price
    photo
    description
    options {
      name
      extra
      choices {
        name
        extra
      }
    }
  }
`;

export const ORDERS_FRAGMENT = gql`
  fragment OrderParts on Order {
    id
    createdAt
    total
  }
`;
