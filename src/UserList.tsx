import * as React from "react";
import {
  graphql,
  createFragmentContainer,
  LocalQueryRenderer,
} from "react-relay";
import { createQueryRendererModern } from "./relay";
import { Flex } from "rebass";
import {
  alignItems,
  flexDirection,
  justifyContent,
  space,
} from "styled-system";
import styled from "styled-components";

import { createOperationDescriptor, ConcreteRequest } from "relay-runtime";
import Environment from "./relay/Environment";

import { UserList_query } from "./__generated__/UserList_query.graphql";
import { UserListQuery } from "./__generated__/UserListQuery.graphql";

const Card = styled.a`
  border-radius: 2px;
  display: flex;
  max-width: 265px;
  width: 200px;
  background-color: #ffffff;
  box-shadow: 0 1px 5px 0 #dfdfdf, 0 1px 5px 0 #dfdfdf;
  flex-direction: column;
  cursor: pointer;
  margin: 10px;
  ${space}
  ${flexDirection}
  ${alignItems}
  ${justifyContent}
`;

type Props = {
  query: UserList_query;
};
class UserList extends React.Component<Props> {
  render() {
    return <div>{this.props.query.badge.key}</div>;
    // const { query } = this.props;
    // const { users } = query;

    // return (
    //   <Flex flexDirection="column">
    //     {users.edges.map(({ node }) => (
    //       <Card key={node.id}>
    //         <span>User: {node.name}</span>
    //         <span>Email: {node.name}</span>
    //       </Card>
    //     ))}
    //   </Flex>
    // );
  }
}

const UserListFragmentContainer = createFragmentContainer(UserList, {
  query: graphql`
    fragment UserList_query on Query {
      badge {
        key
      }
    }
  `,
});

const query = graphql`
  query UserListQuery {
    ...UserList_query
  }
`;

const operation = createOperationDescriptor(
  ((query as unknown) as { default: ConcreteRequest }).default,
  {}
);
Environment.commitPayload(operation, {
  badge: {
    key: "DRAFTING",
  },
});

function Renderer() {
  return (
    <LocalQueryRenderer<UserListQuery>
      environment={Environment}
      query={query}
      variables={{}}
      render={({ props, error }) => {
        if (props) {
          return <UserListFragmentContainer query={props} />;
        } else if (error) {
          console.error(error);
        } else {
          return null;
        }
      }}
    />
  );
}

export default Renderer;
