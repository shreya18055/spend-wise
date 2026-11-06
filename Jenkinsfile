
pipeline {
    agent any

    environment {
        // Java and Maven configuration
        JAVA_HOME = '/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home'
        MAVEN_HOME = '/opt/homebrew/Cellar/maven/3.10.0/libexec'

        PATH = "${JAVA_HOME}/bin:${MAVEN_HOME}/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

        // Azure Container Registry configuration
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
                    echo "Checking development environment..."

                    echo "JAVA_HOME=$JAVA_HOME"
                    echo "MAVEN_HOME=$MAVEN_HOME"

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
                        sh '''
                            echo "Building Spring Boot backend..."
                            mvn clean package
                        '''
                    }
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

        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "Building backend Docker image..."

                    docker build \
                        -t ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                        ./backend

                    echo "Building frontend Docker image..."

                    docker build \
                        -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        .

                    echo "Tagging backend image..."

                    docker tag \
                        ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                        ${BACKEND_IMAGE}:latest

                    echo "Tagging frontend image..."

                    docker tag \
                        ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        ${FRONTEND_IMAGE}:latest

                    echo "Docker images built successfully."
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

                        echo "Logging in to Azure Container Registry..."

                        echo "$ACR_PASSWORD" | docker login \
                            ${ACR_LOGIN_SERVER} \
                            --username "$ACR_USERNAME" \
                            --password-stdin

                        echo "Pushing backend image..."

                        docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${BACKEND_IMAGE}:latest

                        echo "Pushing frontend image..."

                        docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${FRONTEND_IMAGE}:latest

                        echo "Logging out from Azure Container Registry..."

                        docker logout ${ACR_LOGIN_SERVER}

                        echo "Images pushed successfully!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '''
            ==========================================
            SPENDWISE CI/CD PIPELINE SUCCESSFUL!
            ==========================================
            Backend built and tested.
            Frontend built successfully.
            Docker images created.
            Docker images pushed to Azure ACR.
            ==========================================
            '''
        }

        failure {
            echo '''
            ==========================================
            SPENDWISE CI/CD PIPELINE FAILED!
            ==========================================
            Please check the Jenkins Console Output
            for the stage that caused the failure.
            ==========================================
            '''
        }
    }
}
