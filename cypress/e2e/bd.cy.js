describe('Haremos una conexión con MySQL', () => {
    it('Debe obtener los resultados de una consulta', () => {
        cy.task('queryDB', 'SELECT * FROM users').then(
            (results) => {
                cy.log(results)
                //expect(results.length).to.equal(4);
            }
        );
    });
});