var config = require('./config');

module.exports = function(grunt) {

	grunt.initConfig({
		// Project configuration.
		pkg: grunt.file.readJSON('package.json'),

		jekyll: {
			options: {
				src: './docs',
				dest: './_site',
				config: './_config.yml'
			},
			serve: {
				options: {
					serve: false
				}
			}
		},

		//Handle vendor prefixing
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 8', 'ie 9']
			},
			dist: {
				src: '_site/*.css'
			}
		},

		//upload static files to qiniu space
		qiniu: {
			config: {
				options: {
					accessKey: config.accessKey,
					secretKey: config.secretKey,
					bucket: config.bucket,
					domain: config.domain,
					resources: [{
						cwd: '_site/js/',
						pattern: '**/*.*',
					}, {
						cwd: '_site/',
						pattern: 'main.css'
					}, {
						cwd: '_site/',
						pattern: 'bower_components/octicons/octicons/*.*'
					}, ],
					keyGen: function(cwd, file) {
						return 'assets/' + file;
					}
				}
			}
		},

		buildcontrol: {
			options: {
				dir: '_site',
				commit: true,
				push: true,
				message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
			},
			pages: {
				options: {
					remote: 'git@github.com:aisuhua/blog.git',
					branch: 'gh-pages'
				}
			}
		}
	});

	// Load dependencies
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-build-control');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-parker');
	grunt.loadNpmTasks('grunt-qiniu-deploy');

	// Generate and format the CSS
	grunt.registerTask('default', ['jekyll', 'autoprefixer']);

	grunt.registerTask('upload', ['qiniu']);

	// Publish to GitHub
	grunt.registerTask('publish', ['jekyll', 'autoprefixer', 'buildcontrol:pages']);
};
