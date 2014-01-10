module.exports = function(grunt) {

	grunt.initConfig({
		concat : {
			nodejs : {
				src : ['paymill.js', 'lib/*.js','lib/models/*.js','lib/services/*.js','libnode/*.js'],
				dest : 'paymill.node.js',
			},
			parse : {
				src : ['paymill.js', 'lib/*.js','lib/models/*.js','lib/services/*.js','libparse/*.js'],
				dest : 'paymill.parse.js',

			},
			apiomat : {
                                src : ['paymill.js', 'lib/*.js','lib/models/*.js','lib/services/*.js','libapiomat/*.js'],
                                dest : 'paymill.apiomat.js',

                        },
		},
	});
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task.
	grunt.registerTask('default', ['concat']);

};
