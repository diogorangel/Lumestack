import { User } from "../../../src/models";

describe('Visualizar histórico de transações com sucesso', () => {
  it('Deve exibir o histórico de transações de um usuário corretamente', () => {
    cy.task("db:seed");
    cy.database("filter", "users").then((users) => {
      const user = users[0];
      cy.loginByXstate(user.username);
      cy.getBySelLike("personal-tab").click();
      cy.getBySel("transaction-list").should("be.visible");
      cy.getBySel("transaction-item").should("have.length.greaterThan", 0);
    });
  });
});

describe('Tentar visualizar o histórico de transações sem transações anteriores', () => {
  it('Deve exibir uma mensagem indicando que o usuário não possui transações anteriores', () => {
    cy.task("db:seed");
    cy.intercept("GET", "/transactions", { body: [] }).as("personalTransactions");
    cy.database("filter", "users").then((users) => {
      const user = users[0];
      cy.loginByXstate(user.username);
      cy.getBySelLike("personal-tab").click();
      cy.wait("@personalTransactions");
      cy.getBySel("transaction-list").should("be.visible");
      cy.getBySel("empty-list-header").should("contain", "No Transactions");
    });
  });
});