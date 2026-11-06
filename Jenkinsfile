
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        PATH = "/opt/homebrew/bin:/opt/homebrew/opt/openjdk@21/bin:/Applications/Docker.app/Contents/Resources/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling SpendWise source code from GitHub...'
                checkout scm
            }
        }

        stage('Check Tools') {
            steps {
                sh '''
                    echo "Checking installed tools..."
                    java -version
                    mvn -version
                    node --version
                    npm --version
                    docker --version
                '''
            }
        }

        stage('Backend Build and Test') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Building and testing Spring Boot backend..."
                        mvn clean test
                    '''
                }
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                    echo "Installing frontend dependencies..."
                    npm ci

                    echo "Building React frontend..."
                    npm run build
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                    echo "Building backend Docker image..."
                    docker build \
                        -t spendwise-backend:${BUILD_NUMBER} \
                        -t spendwise-backend:latest \
                        ./backend
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                    echo "Building frontend Docker image..."
                    docker build \
                        -t spendwise-frontend:${BUILD_NUMBER} \
                        -t spendwise-frontend:latest \
                        -f Dockerfile .
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: SpendWise CI/CD pipeline completed!'
            echo 'Backend and frontend Docker images were created.'
        }

        failure {
            echo 'FAILED: SpendWise pipeline encountered an error.'
            echo 'Check the console output to identify the failed stage.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
