javac -classpath /home/hadoopuser/hadoop/hadoop-core-1.0.3.jar:/home/hadoopuser/hadoop/lib/commons-lang-2.4.jar -d bin src/adv/datamining/*.java
jar -cvf kmeansmr.jar -C bin .
cp kmeansmr.jar ../
