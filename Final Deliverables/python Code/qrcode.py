import cv2
import numpy as np
import time
import pyzbar.pyzbar as pyzbar
from ibmcloudant import CouchDbSessionAuthenticator
from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_cloud_sdk_core.authenticators import BasicAuthenticator

authenticator = BasicAuthenticator('apikey-v2-v15lcj6pvfp4478gn9ila9quezmlc6wx35gsa5an7cp','66d5a65b81360dd97cc802ea47a8ebd7')
service= CloudantV1 (authenticator=authenticator)
service.set_service_url('https://4ec8693c-41dd-43b0-87a9-eabb98825ef3-bluemix.cloudantnosqldb.appdomain.cloud/')

cap = cv2.VideoCapture(0)
font = cv2.FONT_HERSHEY_PLAIN

while True:
	_, frame = cap.read()
	decodedObjects = pyzbar.decode (frame)
	for obj in decodedObjects:
		#print ("Data", obj.data)
		a=obj.data.decode('UTF-8')
		cv2.putText(frame, "Ticket", (50, 50), font, 2,
                            (255, 0, 0), 3)
		print(a)
		try:
			response = service.get_document(
                            db='booking',
                            doc_id=a
			).get_result()
			print (response)
			time.sleep(5)
		except Exception as e:
			print ("Not a Valid Ticket")
			time.sleep(5)

	cv2.imshow("Frame",frame)
	if cv2.waitKey(1) & 0xFF ==ord('q'):
		break
cap.release()
cv2.destroyAllWindows()
client.disconnect()
