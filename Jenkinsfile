
pipeline {
    agent any

    environment {
        // Java 21 configuration
        JAVA_HOME = '/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home'

        // Maven configuration
        MAVEN_HOME = '/opt/homebrew/Cellar/maven/3.10.0/libexec'

        // Environment PATH
        PATH = "${JAVA_HOME}/bin:${MAVEN_HOME}/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

        // Azure Container Registry
        ACR_LOGIN_SERVER = 'spendwiseacr2026.azurecr.io'

        // Docker image names
        BACKEND_IMAGE = 'spendwiseacr2026.azurecr.io/spendwise-backend'
        FRONTEND_IMAGE = 'spendwiseacr2026.azurecr.io/spendwise-frontend'
    }

    stages {

        // Stage 1: Checkout source code
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Stage 2: Verify installed tools
        stage('Check Tools') {
            steps {
                sh '''
                    echo "=================================="
                    echo "CHECKING DEVELOPMENT ENVIRONMENT"
                    echo "=================================="

                    echo "JAVA_HOME=$JAVA_HOME"
                    echo "MAVEN_HOME=$MAVEN_HOME"

                    echo "Java version:"
                    java -version

                    echo "Maven version:"
                    mvn -version

                    echo "Node.js version:"
                    node --version

                    echo "NPM version:"
                    npm --version

                    echo "Docker version:"
                    docker --version

                    echo "Kubectl version:"
                    kubectl version --client

                    echo "All tools checked successfully."
                '''
            }
        }

        // Stage 3: Build and test Spring Boot backend
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

                            echo "Backend build completed."
                        '''
                    }
                }
            }
        }

        // Stage 4: Build React frontend
        stage('Frontend Build') {
            steps {
                sh '''
                    echo "Installing frontend dependencies..."

                    npm ci

                    echo "Building React frontend..."

                    npm run build

                    echo "Frontend build completed."
                '''
            }
        }

        // Stage 5: Build Docker images
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

        // Stage 6: Push Docker images to Azure ACR
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

                        echo "Both images pushed successfully!"
                    '''
                }
            }
        }

        // Stage 7: Deploy application to Azure Kubernetes Service
        stage('Deploy to AKS') {
            steps {
                sh '''
                    set -e

                    export KUBECONFIG=/Users/shreyanandagopal/.kube/config

                    echo "=================================="
                    echo "DEPLOYING SPENDWISE TO AKS"
                    echo "=================================="

                    echo "Checking AKS connection..."

                    kubectl config current-context
                    kubectl get nodes

                    echo "Updating backend deployment..."

                    kubectl set image deployment/backend \
                        spendwise-backend=${BACKEND_IMAGE}:${BUILD_NUMBER} \
                        -n spendwise

                    echo "Updating frontend deployment..."

                    kubectl set image deployment/frontend \
                        spendwise-frontend=${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        -n spendwise

                    echo "Waiting for backend rollout..."

                    kubectl rollout status deployment/backend \
                        -n spendwise --timeout=180s

                    echo "Waiting for frontend rollout..."

                    kubectl rollout status deployment/frontend \
                        -n spendwise --timeout=180s

                    echo "Verifying deployments..."

                    kubectl get deployments,pods -n spendwise

                    echo "AKS deployment completed successfully!"
                '''
            }
        }
    }

    // Post-build actions
    post {
        success {
            echo '''
            ==========================================
            SPENDWISE CI/CD PIPELINE SUCCESSFUL!
            ==========================================
            Backend build and test completed.
            Frontend build completed.
            Docker images built successfully.
            Images pushed to Azure Container Registry.
            Application deployed to Azure Kubernetes Service.
            Deployment rollouts verified successfully.
            ==========================================
            '''
        }

        failure {
            echo '''
            ==========================================
            SPENDWISE CI/CD PIPELINE FAILED!
            ==========================================
            Check Jenkins Console Output for errors.
            ==========================================
            '''
        }
    }
}
