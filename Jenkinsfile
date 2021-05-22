def yarn_home = "/var/jenkins_home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/nodejs/lib/node_modules/yarn";
pipeline {
    stages {
        stage('pull code') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/test']], extensions: [], userRemoteConfigs: [[credentialsId: 'sshkey', url: 'git@github.com:1zilc/fishing-funds.git']]])
            }
        }
        stage('build project') {
            steps {
                yarn 'yarn install'
                yarn 'yarn build'
            }
        }
        stage('package and publish') {
            agent {
                docker {
                    image 'electronuserland/builder:lastest'
                }
            }
            steps {
                sh 'export GH_TOKEN="8afc0563941b2480f54227a4c0cbbab93f16e122"'
                sh 'electron-builder build -mwl -p always'
            }
        }
    }
}
