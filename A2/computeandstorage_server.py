import grpc
import sys
sys.path.append('generated/') 
import computeandstorage_pb2
import computeandstorage_pb2_grpc
import boto3
from concurrent import futures

class EC2OperationsServicer(computeandstorage_pb2_grpc.EC2OperationsServicer):
    def StoreData(self, request, context):
        # Extract the data from the request
        data = request.data

        # Generate a unique filename or key for the S3 object
        filename = 'data_file.txt' 

        # Create a new S3 client
        s3_client = boto3.client('s3')
        
        # Bucket name
        bucket_name = "almas-test-bucket"

        # Store the data in the S3 bucket
        s3_client.put_object(Body=data, Bucket=bucket_name, Key=filename)

        # Generate the publicly readable URL for the stored file
        file_url = f'https://{bucket_name}.s3.amazonaws.com/{filename}'

        print("StoreData:", file_url)

        # Create a response message with the file URL
        response = computeandstorage_pb2.StoreReply(s3uri=file_url)

        return response

    def AppendData(self, request, context):
        # Extract the data from the request
        data = request.data

        # Retrieve the existing file from S3
        filename = 'data_file.txt'  # The name of the existing file in S3

        # Create a new S3 client
        s3_client = boto3.client('s3')

        bucket_name = "almas-test-bucket"

        # Get the existing file's contents
        response = s3_client.get_object(Bucket=bucket_name, Key=filename)
        existing_data = response['Body'].read().decode('utf-8')

        # Append the new data to the existing file's contents
        updated_data = existing_data + data

        # Store the updated data in the S3 bucket
        s3_client.put_object(Body=updated_data, Bucket=bucket_name, Key=filename)

        # Generate the publicly readable URL for the updated file
        file_url = f'https://{bucket_name}.s3.amazonaws.com/{filename}'

        print("AppendData:", file_url)

        # Create a response message with the file URL
        response = computeandstorage_pb2.AppendReply()

        return response

    def DeleteFile(self, request, context):
        
        # Specifying the bucket name
        bucket_name = "almas-test-bucket"

        # Specifying the file name
        file_name = 'data_file.txt'

        # Create a new S3 client
        s3_client = boto3.client('s3')
    
        # Delete the file from the S3 bucket
        s3_client.delete_object(Bucket=bucket_name, Key=file_name)
       
        return computeandstorage_pb2.DeleteReply()


def serve():
    # Create a gRPC server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    computeandstorage_pb2_grpc.add_EC2OperationsServicer_to_server(EC2OperationsServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


def main():
    serve()


if __name__ == '__main__':
    main()
