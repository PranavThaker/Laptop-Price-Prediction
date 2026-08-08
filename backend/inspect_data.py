import pickle

df = pickle.load(open("model/df.pkl","rb"))

print("\nDATAFRAME SHAPE")
print(df.shape)

print("\nCOLUMNS")
print(df.columns.tolist())

categorical_columns=[
    "Company",
    "TypeName",
    "Cpu brand",
    "Gpu brand",
    "os"
]

for column in categorical_columns:
    print(f"\n------------------{column}---------------------")
    print(df[column].value_counts())