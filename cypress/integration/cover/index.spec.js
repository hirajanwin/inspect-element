/// <reference types="cypress" />

import path from 'path'

describe('cover', () => {
  it('should works', () => {
    cy.visit(path.join(__dirname, 'index.html'))

    cy.get('#test').trigger('keydown', { keycode: 91, release: false }).trigger('mousemove', { clientX: 0, clientY: 0 })

    cy.get('#inspect-element-cover')
      .should('have.css', 'width', '30px')
      .should('have.css', 'height', '40px')
      .should('have.css', 'border-top-width', '0px')
      .should('have.css', 'border-right-width', '0px')
      .should('have.css', 'border-bottom-width', '0px')
      .should('have.css', 'border-left-width', '0px')

    cy.get('#test').trigger('keyup', { keycode: 91, release: true })
  })
})
