var path = require('path')
var fs = require('vigour-fs-promised')
var log = require('npmlog')
var exec = require('../utils/exec')
var config
var pwd

var github = module.exports = {
	init: function(cfg){
		pwd = process.cwd()
		config = cfg
	}, 
	clone: function(){
		return checkIfRepoCloned()
			.then(cloneRepo)
	},
	update: function(){
		changeDir()
		return pullBranch()
		.then(removeNodeModules)
		.then(installGaston)
		.then(npmInstall)
		.then(runTests)
		.then(runBuild)
		.then(runDist)
		.then(changeDirBack)
	}
}

var checkIfRepoCloned = function(){
	console.log('checking if repo is already cloned')
	return fs.existsAsync(config.path)
}
var cloneRepo = function(isCloned){
	if(isCloned){
		return true
	}
	var remote = config.remote
	var branch = config.branch
	var cmd = `git clone --branch=${branch} --depth=10 ${remote} ${config.path}`
	console.log(`$ ${cmd}`)
	return exec(cmd, true)
}

var removeNodeModules = function(){
	console.log('$ rm -rf node_modules')
	return exec('rm -rf node_modules', true)
}

var npmInstall = function(){
	console.log('$ npm install')
	return exec('npm install', true)
}

var installGaston = function(){
	console.log('$ npm install gaston')
	return exec('npm install gaston', true)
}

var runTests = function(){
	return exec('npm run test', true)
}

var runBuild = function(){
	return exec('npm run build', true)
}

var runDist = function(){
	return exec('npm run dist', true)
}

var changeDir = function(){
	console.log(`$ cd ${config.path}`)
	return process.chdir(config.path)
}

var changeDirBack = function(){
	console.log(`$ cd ${pwd}`)
	return process.chdir(pwd)
}

var pullBranch = function(shouldPull){
	var cmd = `git pull origin ${config.branch}`
	console.log(`$ ${cmd}`)
	return exec(cmd, true)
}

