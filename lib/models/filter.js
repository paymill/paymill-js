/**
 *
 * Creates a new Filter. Use factories of implementing classes.
 * @class Filter
 */
function Filter() {

}
/**
 * Descibes equality for filters.
 * @memberof Filter
 * @property {string} EQUAL
 * @property {string} LESS_THAN
 * @property {string} GREATER_THAN
 */
Filter.EQUALITY = {
	"LESS_THAN" : "<",
	"GREATER_THAN" : ">",
	"EQUAL" : ""
};