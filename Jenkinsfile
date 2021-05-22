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
        }
        stage('package and publish') {
            agent {
                docker {
                    image 'electronuserland/builder:wine'
                    args '--env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
                    --env ELECTRON_CACHE="/root/.cache/electron" \
                    --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
                    -v ${PWD}:/project \
                    -v ${PWD##*/}-node-modules:/project/node_modules \
                    -v ~/.cache/electron:/root/.cache/electron \
                    -v ~/.cache/electron-builder:/root/.cache/electron-builder \'
                }
            }
            steps {
                sh 'export GH_TOKEN="8afc0563941b2480f54227a4c0cbbab93f16e122"'
                sh 'electron-builder build -mwl -p always'
            }
        }
    }
}
