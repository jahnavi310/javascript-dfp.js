module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	jshint: {
		all: ['Gruntfile.js', 'javascript-dfp.js']
	},
	uglify: {
		build: {
			src: 'javascript-dfp.js',
			dest: 'javascript-dfp.min.js'
		}
	}
});

// Load the plugin that provides the "jshint" task.
grunt.loadNpmTasks('grunt-contrib-jshint');

// Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks('grunt-contrib-uglify');

// Load the plugin that provides the "jasmine" task.
//grunt.loadNpmTasks('grunt-contrib-jasmine');

// Default task(s).
grunt.registerTask('default', ['jshint', 'uglify']);

};
