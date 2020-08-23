/// <reference types="cypress" />

import path from 'path'

describe('border-and-border-box', () => {
  it('should works', () => {
    cy.visit(path.join(__dirname, 'index.html'))

    cy.get('#test').trigger('keydown', { keycode: 91, release: false }).trigger('mousemove', { clientX: 0, clientY: 0 })

    cy.get('#inspect-element-cover')
      .should('have.css', 'width', '0px')
      .should('have.css', 'height', '0px')
      .should('have.css', 'border-top-width', '0px')
      .should('have.css', 'border-right-width', '0px')
      .should('have.css', 'border-bottom-width', '0px')
      .should('have.css', 'border-left-width', '0px')

    cy.get('#inspect-element-border')
      .should('have.css', 'width', '0px')
      .should('have.css', 'height', '0px')
      .should('have.css', 'border-top-width', '70px')
      .should('have.css', 'border-right-width', '71px')
      .should('have.css', 'border-bottom-width', '72px')
      .should('have.css', 'border-left-width', '73px')

    cy.get('#test').trigger('keyup', { keycode: 91, release: true })
  })
})
