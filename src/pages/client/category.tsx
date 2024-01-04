import { gql, useQuery } from "@apollo/client";
import { CategoryQuery, CategoryQueryVariables } from "../../gql/graphql";
import { useParams } from "react-router-dom";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
      category {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
  }
`;

export const Category = () => {
  const params = useParams();
  const { data } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: params.slug,
        },
      },
    }
  );
  console.log(data);

  return <h1>Category</h1>;
};
