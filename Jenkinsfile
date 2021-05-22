pipeline {
    agent any
    stages {
        stage('pull code') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/test']], extensions: [], userRemoteConfigs: [[credentialsId: 'sshkey', url: 'git@github.com:1zilc/fishing-funds.git']]])
            }
        }
        stage('build project') {
            agent {
                docker { image 'node:latest' }
            }
            steps {
                sh 'yarn install'
                sh 'yarn build'
            }
            steps {
                sh 'export GH_TOKEN="8afc0563941b2480f54227a4c0cbbab93f16e122"'
                sh 'electron-builder build -mwl -p always'
            }
        }
    }
}
