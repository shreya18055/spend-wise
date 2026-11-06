
pipeline {
    agent any

    environment {
        ACR_LOGIN_SERVER = 'spendwiseacr2026.azurecr.io'
        BACKEND_IMAGE = 'spendwiseacr2026.azurecr.io/spendwise-backend'
        FRONTEND_IMAGE = 'spendwiseacr2026.azurecr.io/spendwise-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Tools') {
            steps {
                sh '''
                    java -version
                    mvn -version
                    node -version
                    npm -version
                    docker --version
                '''
            }
        }

        stage('Backend Build and Test') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'spendwise-db-password',
                        variable: 'DB_PASSWORD'
                    )
                ]) {
                    dir('backend') {
                        sh 'mvn clean package'
                    }
                }
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                    npm ci
                    npm run build
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ./backend
                    docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} .
                    docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest
                    docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Push Images to Azure ACR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'spendwise-acr-credentials',
                        usernameVariable: 'ACR_USERNAME',
                        passwordVariable: 'ACR_PASSWORD'
                    )
                ]) {
                    sh '''
                        set +x
                        echo "$ACR_PASSWORD" | docker login ${ACR_LOGIN_SERVER} \
                            --username "$ACR_USERNAME" \
                            --password-stdin

                        docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${BACKEND_IMAGE}:latest

                        docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${FRONTEND_IMAGE}:latest

                        docker logout ${ACR_LOGIN_SERVER}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'SpendWise CI/CD pipeline completed. Docker images pushed to Azure ACR.'
        }
        failure {
            echo 'SpendWise CI/CD pipeline failed. Check the stage logs.'
        }
    }
}
