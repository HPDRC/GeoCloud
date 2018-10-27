package adv.datamining;

import java.util.ArrayList;

/*
 * Definition for data point
 * 
 * Member:
 *     @id
 *     @coordinates
 *     (Distance calculated as Euclidean distance)
 */

public class Point {
	public int id;
	public ArrayList<Double> coordinates;

	Point() {
		id = -1;
		coordinates = new ArrayList<Double>();
	}

	Point(int id, ArrayList<Double> c) {
		this.id = id;
		this.coordinates = new ArrayList<Double>(c);
	}

	/*
	 * Constructor from String delimited by comma like this: 
	 *     0,6.915074975090942,1.987097505079365
	 *     
	 * Parameters:
	 *     @s
	 *     @hasId: if true, the first element will be parsed as integer ID, else all considered to be coordinates
	 */
	Point(String s, boolean hasId) {
		String[] tmp = s.split(",");
		ArrayList<Double> t = new ArrayList<Double>();

		for (int i = hasId ? 1 : 0; i < tmp.length; ++i) {
			t.add(Double.parseDouble(tmp[i]));
		}
		this.id = hasId ? Integer.parseInt(tmp[0]) : -1;		
		
		this.coordinates = new ArrayList<Double>(t);
	}

	/*
	 * Get Euclidean distance with another Point instance
	 * If dimension not match, return -1
	 */
	public double getDistance(Point other) {
		double distance = 0;
		if (this.coordinates.size() == other.coordinates.size()) {
			for (int i = 0; i < this.coordinates.size(); ++i) {
				distance += Math.pow(this.coordinates.get(i)
						- other.coordinates.get(i), 2);
			}
			distance = Math.sqrt(distance);
		} else {
            distance = -1;
        }
		return distance;
	}

}
