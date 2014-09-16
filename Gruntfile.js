module.exports = function(grunt) {

	grunt.initConfig({
		concat : {
			nodejs : {
				src : ['paymill.js','libnode/*.js', 'lib/*.js','lib/models/*.js','lib/services/*.js'],
				dest : 'paymill.node.js',
			},
			parse : {
				src : ['paymill.js','libparse/*.js', 'lib/*.js','lib/models/*.js','lib/services/*.js'],
				dest : 'paymill.parse.js',

			},
			apiomat : {
                                src : ['paymill.js', 'libapiomat/*.js', 'lib/*.js','lib/models/*.js','lib/services/*.js',],
                                dest : 'paymill.apiomat.js',

                        },
		},
	});
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task.
	grunt.registerTask('default', ['concat']);

};
