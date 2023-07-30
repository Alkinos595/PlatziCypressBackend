describe('Probando mongo', () => {
    after(() => {
      cy.task('borrarMongo')
    })
    it('Select de mongo', () => {
        cy.task('queryMongo').then(
            (results) => {
                cy.log(results)
                expect(results).to.have.length(3)
            }
        );
    });
    it('create de mongo', () => {
        cy.task('crearMongo', {
            "id": 4,
            "first_name": "Cuatro",
            "last_name": "Cuatrero",
            "email": "cuatro@platzi.com"
        }).then(
            (results) => {
                console.log(results)
                expect(results.acknowledged).to.eq(true);
                expect(results).to.haveOwnPropertyDescriptor("insertedId");
            }
        );
    });
});