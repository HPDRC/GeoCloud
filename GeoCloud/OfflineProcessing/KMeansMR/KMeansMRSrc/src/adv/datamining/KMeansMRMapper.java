package adv.datamining;

import java.io.IOException;
import java.util.*;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.conf.Configuration;

import adv.datamining.Point;

public class KMeansMRMapper extends Mapper<LongWritable, Text, Text, Text> {

	private static double MAXDISTANCE = Double.MAX_VALUE;

	// Store the centers for test in mapping
	private ArrayList<Point> centers = new ArrayList<Point>();

	/* 
	 * Read cluster centers from the previous iteration
	 * In the first iteration, read from user assigned centers
	 * In later iterations, read from `nextCenter` folder that is written by reducer in previous iterations 
	 */
	protected void setup(Context context) throws IOException,
			InterruptedException {

		Configuration conf = context.getConfiguration();
		String[] clusterCenterFiles = conf.get("mapperReadCenter").split(":");

		int centerId = 0;
		FileSystem fs = FileSystem.get(conf);
		for (String src : clusterCenterFiles) {
			try {
				BufferedReader myReader = new BufferedReader(
						new InputStreamReader(fs.open(new Path(src))));
				String line = myReader.readLine();
				while (line != null) {
					if (line.trim() != "") {
						Point p = new Point(line, true);
						p.id = centerId++;
						centers.add(p);
					}
					line = myReader.readLine();
				}
				myReader.close();
			} catch (Exception e) {
				//throw e;
			}
		}
	}

	public void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {

		System.out.println("Map running");

		try {
			String line = value.toString();
			if (line != "") {
				String[] parts = line.split("\t");
				String sp = parts[parts.length - 1];

				Point curPnt = new Point(sp, true);

				double minDist = MAXDISTANCE, tmpDist;
				int minCenterId = 0;

				// find the closest center
				for (Point p : centers) {
					tmpDist = curPnt.getDistance(p);
					if (tmpDist < minDist) {
						// found closer center
						minDist = tmpDist;
						minCenterId = p.id;
					}
				}

				// output: <centerid, current point>
				context.write(new Text(Integer.toString(minCenterId)),
						new Text(sp));
			}

		} catch (Exception e) {
			System.out.printf(e.toString());
			//throw e;
		}
	}

	/*
	 * Write centers that've been used in this iteration to `currentCenter` folder
	 */
	protected void cleanup(Context context) throws IOException,
			InterruptedException {

		Configuration conf = context.getConfiguration();
		int taskId = context.getTaskAttemptID().getTaskID().getId();

		FileSystem fs = FileSystem.get(conf);
		Path currentCenterFile = new Path(conf.get("currentCenter")
				+ File.separator + "iteration_" + conf.get("iteration")
				+ File.separator + "centers_" + taskId);

		BufferedWriter br = new BufferedWriter(new OutputStreamWriter(
				fs.create(currentCenterFile, true)));

		for (Point p : centers) {
			br.write(Integer.toString(p.id) + ","
					+ StringUtils.join(p.coordinates, ",") + "\n");
		}
		br.close();
	}
}
